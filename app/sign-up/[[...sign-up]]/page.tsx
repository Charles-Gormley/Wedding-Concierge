import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-primary hover:bg-primary/90 text-primary-foreground",
            card: "bg-background shadow-lg",
            headerTitle: "text-foreground",
            headerSubtitle: "text-muted-foreground",
            socialButtonsBlockButton: 
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            formFieldLabel: "text-foreground",
            formFieldInput: 
              "border border-input bg-background text-foreground",
            footerActionLink: "text-primary hover:text-primary/90",
          },
        }}
      />
    </div>
  );
} 