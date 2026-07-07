import { Globe, Lock, Mail, Save, Shield, Store } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-bold text-black">Settings</h1>
        <p className="mt-1 text-[14px] text-zinc-500">
          Manage store details, contact information, and dashboard preferences.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                <Store className="h-5 w-5 text-black" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-black">Store Profile</h2>
                <p className="text-[13px] text-zinc-500">
                  Main business information shown across the dashboard.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13px] font-medium text-zinc-700">
                  Store Name
                </label>
                <input
                  type="text"
                  defaultValue="Royal Braids Ltd"
                  className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-medium text-zinc-700">
                  Support Email
                </label>
                <input
                  type="email"
                  defaultValue="info@royalbraids.ug"
                  className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-medium text-zinc-700">
                  Phone
                </label>
                <input
                  type="text"
                  defaultValue="+256 793 695 678"
                  className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-medium text-zinc-700">
                  Currency
                </label>
                <input
                  type="text"
                  defaultValue="UGX"
                  className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                <Globe className="h-5 w-5 text-black" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-black">Website Links</h2>
                <p className="text-[13px] text-zinc-500">
                  Configure storefront and social links.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-[13px] font-medium text-zinc-700">
                  Website URL
                </label>
                <input
                  type="url"
                  defaultValue="https://royalbraids.vercel.app"
                  className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-medium text-zinc-700">
                  Instagram URL
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/royalbraids"
                  className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
                <Shield className="h-5 w-5 text-black" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-black">Admin Preferences</h2>
                <p className="text-[13px] text-zinc-500">
                  Dashboard contact and notification settings.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-4">
                <Mail className="mt-0.5 h-4 w-4 text-zinc-600" />
                <div>
                  <p className="text-[14px] font-medium text-black">
                    Product update emails
                  </p>
                  <p className="text-[12px] text-zinc-500">
                    Receive notifications for product changes and submissions.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-4">
                <Lock className="mt-0.5 h-4 w-4 text-zinc-600" />
                <div>
                  <p className="text-[14px] font-medium text-black">
                    Secure dashboard access
                  </p>
                  <p className="text-[12px] text-zinc-500">
                    Review your login and admin protection settings regularly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
            <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-black px-5 text-[14px] font-medium text-white transition-all hover:bg-zinc-800">
              <Save className="h-4 w-4" />
              Save Settings
            </button>
            <p className="mt-3 text-center text-[12px] text-zinc-400">
              This screen is ready for your live settings wiring.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
