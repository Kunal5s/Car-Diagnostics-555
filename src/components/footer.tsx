export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex-col items-center justify-center py-6 text-center text-sm text-muted-foreground md:flex-row">
        <p>
          © {new Date().getFullYear()} Car Diagnostics AI. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
