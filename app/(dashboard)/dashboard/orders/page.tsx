import prisma from "@/lib/prisma";
import { PackageCheck, ShoppingCart, Truck, AlertCircle } from "lucide-react";
import { updateOrderStatus } from "@/lib/actions";

export const dynamic = "force-dynamic";

async function getOrders() {
  try {
    return await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}

function getStatusTone(status: string) {
  switch (status) {
    case "Delivered":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100";
    case "Shipped":
      return "bg-sky-50 text-sky-700 ring-1 ring-sky-100";
    case "Cancelled":
      return "bg-red-50 text-red-700 ring-1 ring-red-100";
    case "Paid":
      return "bg-violet-50 text-violet-700 ring-1 ring-violet-100";
    default:
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
  }
}

export default async function OrdersPage() {
  const orders = await getOrders();

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalCents, 0);
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const shippedOrders = orders.filter((order) => order.status === "Shipped").length;
  const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;

  async function updateStatusAction(formData: FormData) {
    "use server";

    const orderId = Number(formData.get("orderId"));
    const status = String(formData.get("status") || "");

    if (!orderId || !status) {
      return;
    }

    await updateOrderStatus(orderId, status);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-black">Orders</h1>
          <p className="text-[14px] text-zinc-500">
            View all customer orders placed on the website.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<ShoppingCart className="h-5 w-5 text-black" />}
          label="Total Orders"
          value={orders.length.toString()}
        />
        <SummaryCard
          icon={<AlertCircle className="h-5 w-5 text-amber-600" />}
          label="Pending"
          value={pendingOrders.toString()}
        />
        <SummaryCard
          icon={<Truck className="h-5 w-5 text-sky-600" />}
          label="Shipped"
          value={shippedOrders.toString()}
        />
        <SummaryCard
          icon={<PackageCheck className="h-5 w-5 text-emerald-600" />}
          label="Revenue"
          value={`UGX ${totalRevenue.toLocaleString()}`}
        />
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-zinc-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50">
            <ShoppingCart className="h-8 w-8 text-zinc-300" />
          </div>
          <h2 className="text-[20px] font-bold text-black">No orders yet</h2>
          <p className="mt-2 text-[14px] text-zinc-500">
            Orders placed from the website checkout will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-zinc-50/80">
                <tr className="text-[12px] font-semibold uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Placed</th>
                  <th className="px-6 py-4">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((order) => (
                  <tr key={order.id} className="align-top">
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-[14px] font-semibold text-black">
                          {order.orderNumber}
                        </p>
                        <p className="mt-1 text-[12px] text-zinc-500">
                          {order.city}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-[14px] font-medium text-black">
                          {order.customerName}
                        </p>
                        <p className="mt-1 text-[12px] text-zinc-500">{order.phone}</p>
                        <p className="mt-1 text-[12px] text-zinc-500">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="h-9 w-9 overflow-hidden rounded-lg bg-zinc-100">
                              {item.product.image ? (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-[13px] font-medium text-black">
                                {item.product.name}
                              </p>
                              <p className="text-[12px] text-zinc-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 ? (
                          <p className="text-[12px] font-medium text-zinc-500">
                            +{order.items.length - 3} more item{order.items.length - 3 === 1 ? "" : "s"}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[14px] font-bold text-black">
                        UGX {order.totalCents.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[12px] font-semibold ${getStatusTone(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-[13px] font-medium text-black">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mt-1 text-[12px] text-zinc-500">
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <form action={updateStatusAction} className="flex min-w-[180px] flex-col gap-2">
                        <input type="hidden" name="orderId" value={order.id} />
                        <select
                          name="status"
                          defaultValue={order.status}
                          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-[13px] font-medium text-black outline-none transition focus:border-black/20"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button
                          type="submit"
                          className="inline-flex h-9 items-center justify-center rounded-xl bg-black px-3 text-[12px] font-semibold uppercase tracking-wider text-white transition hover:bg-zinc-800"
                        >
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/60 px-6 py-4 text-[13px] text-zinc-500">
            <span>{orders.length} total order{orders.length === 1 ? "" : "s"}</span>
            <span>{deliveredOrders} delivered</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-50">
        {icon}
      </div>
      <p className="text-[12px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-[24px] font-bold tracking-tight text-black">
        {value}
      </p>
    </div>
  );
}
