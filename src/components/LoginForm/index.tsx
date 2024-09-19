import { account } from "@/lib/appwrite";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import TextInputField from "../TextInputField";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
function LoginForm() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof loginFormSchema>) =>
      account.createEmailPasswordSession(data.email, data.password),
    onSuccess: () => {
      router.navigate({ to: "/" });
    },
  });
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="grid grid-cols-1 gap-8"
      >
        <TextInputField
          formControl={form.control}
          name="email"
          placeholder="Email"
          label="Email"
        />
        <TextInputField
          formControl={form.control}
          name="password"
          placeholder="Password"
          type="password"
          label="Password"
        />
        <Button type="submit" disabled={isPending}>
          Login
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
