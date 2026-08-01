"use client";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
      />

      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.9v2.33A9 9 0 0 0 9 18z"
      />

      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.9A9 9 0 0 0 0 9c0 1.45.35 2.83.9 4.03l3.05-2.33z"
      />

      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .9 4.97l3.05 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}

export function GoogleButton({
  onClick,
  isLoading = false,
  children = "تابع بحساب جوجل",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="
        group
        relative
        flex
        w-full
        items-center
        justify-center
        gap-3
        overflow-hidden
        rounded-lg
        border
        border-black/10
        bg-white
        px-8
        py-4
        text-md
        font-medium
        text-black
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:bg-gray-50
        hover:shadow-md
        disabled:pointer-events-none
        disabled:opacity-50
      "
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span
            className="
              h-4
              w-4
              animate-spin
              rounded-full
              border-2
              border-black/20
              border-t-black
            "
          />
          جاري الاتصال بجوجل...
        </span>
      ) : (
        <>
          <GoogleIcon />
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
