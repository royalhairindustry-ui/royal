import BlogCoverImageField from "@/app/components/BlogCoverImageField";
import SaveChangesButton from "@/app/components/SaveChangesButton";
import FormSwitch from "@/app/components/FormSwitch";

type BlogPostFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaults?: {
    title?: string;
    excerpt?: string | null;
    coverImage?: string | null;
    body?: string;
    author?: string | null;
    isPublished?: boolean;
  };
  submitLabel?: string;
  pendingLabel?: string;
};

export default function BlogPostForm({
  action,
  defaults,
  submitLabel = "Save Post",
  pendingLabel = "Saving...",
}: BlogPostFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div>
        <label className="mb-2 block text-[13px] font-semibold text-zinc-700">
          Title
        </label>
        <input
          type="text"
          name="title"
          required
          defaultValue={defaults?.title ?? ""}
          placeholder="e.g. How to care for braids in dry weather"
          className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
        />
        <p className="mt-1 text-[11px] text-zinc-400">
          The slug is generated automatically from the title.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-[13px] font-semibold text-zinc-700">
          Excerpt
        </label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={defaults?.excerpt ?? ""}
          placeholder="A short teaser shown in the blog list..."
          className="w-full rounded-xl border border-transparent bg-zinc-50 px-4 py-3 text-[14px] outline-none transition-all focus:border-black/10"
        />
      </div>

      <BlogCoverImageField defaultValue={defaults?.coverImage ?? ""} />

      <div>
        <label className="mb-2 block text-[13px] font-semibold text-zinc-700">
          Body (Markdown)
        </label>
        <textarea
          name="body"
          required
          rows={16}
          defaultValue={defaults?.body ?? ""}
          placeholder={"# Section heading\n\nWrite your post in **markdown**.\n\n- bullet one\n- bullet two\n\n[A link](https://example.com)"}
          className="w-full rounded-xl border border-transparent bg-zinc-50 px-4 py-3 font-mono text-[13px] leading-relaxed outline-none transition-all focus:border-black/10"
        />
        <p className="mt-1 text-[11px] text-zinc-400">
          Supports markdown: headings (#), **bold**, *italic*, lists, links,
          images, blockquotes (&gt;), and ``` code blocks.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[13px] font-semibold text-zinc-700">
            Author
          </label>
          <input
            type="text"
            name="author"
            defaultValue={defaults?.author ?? ""}
            placeholder="Royal Braids Team"
            className="h-11 w-full rounded-xl border border-transparent bg-zinc-50 px-4 text-[14px] outline-none transition-all focus:border-black/10"
          />
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
          <FormSwitch
            name="isPublished"
            id="isPublished"
            defaultChecked={defaults?.isPublished ?? false}
          />
          <label
            htmlFor="isPublished"
            className="cursor-pointer text-[14px] font-semibold text-emerald-800"
          >
            Publish immediately
            <span className="block text-[11px] font-normal text-emerald-700">
              Unpublished posts are saved as drafts and hidden from /blog.
            </span>
          </label>
        </div>
      </div>

      <SaveChangesButton label={submitLabel} pendingLabel={pendingLabel} />
    </form>
  );
}
