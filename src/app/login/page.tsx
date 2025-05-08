"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FaPhoneAlt, FaLock } from "react-icons/fa";
import {
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
  FormProvider,
  useForm,
  UseFormStateReturn,
} from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Spinner from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

const LoginSchema = z.object({
  username: z.string().min(3, "Username is too short"),
  password: z.string().min(3, "Password must be atleast 3 characters"),
  remember: z.boolean(),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const methods = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      setIsLoading(true);
      await login(data.username, data.password);
      window.location.href = "/dashboard";
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const onError = (errors: FieldErrors<LoginSchemaType>) => {
    let errorMessage = "Please fix the validation errors before submitting";
    const firstMessage = Object.values(errors)?.[0]?.message;
    if (firstMessage && typeof firstMessage === "string") {
      errorMessage = firstMessage;
    }
    toast.error(errorMessage);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, onError)}
        className="flex flex-col items-center bg-green-500 w-full justify-center min-h-screen overflow-y-clip px-6 py-20 my-auto"
      >
        <Card className="relative flex-grow justify-center w-full max-w-md bg-white shadow-lg rounded-sm pt-10 my-auto">
          <CardHeader className=" w-full text-center my-4">
            <CardTitle className="text-xl font-semibold">
              <span className="text-green-600 font-bold">Welcome!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-6">
              <div className="relative">
                <FaPhoneAlt className="absolute left-3 top-2 text-gray-500 h-10" />
                <Input
                  type="text"
                  className="pl-10 h-14 text-lg md:text-lg"
                  placeholder="Username"
                  {...methods.register("username")}
                  disabled={isLoading}
                />
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-2 text-gray-500 h-10" />
                <Input
                  type="password"
                  className="pl-10 h-14 text-lg md:text-lg"
                  placeholder="Password"
                  {...methods.register("password")}
                  disabled={isLoading}
                />
              </div>
              <Controller
                render={function ({
                  field,
                }: {
                  field: ControllerRenderProps<FieldValues, string>;
                  fieldState: ControllerFieldState;
                  formState: UseFormStateReturn<FieldValues>;
                }): React.ReactElement {
                  return (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        }}
                        id="terms"
                        {...methods.register("remember")}
                        disabled={isLoading}
                      />
                      <Label htmlFor="terms" className="text-sm text-gray-500">
                        Remember me
                      </Label>
                    </div>
                  );
                }}
                name="remember"
              />

              <Button
                type="submit"
                className="w-full flex-row bg-green-600 hover:bg-green-700 font-bold text-xl h-14"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Spinner className="h-10 w-10 text-white" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Bottom Text with Equal Spacing */}
        <div className="flex-grow flex items-center justify-center text-center text-white font-bold ">
          <p className="text-xl">
            Your Trusted Partner in Digital Transactions
          </p>
        </div>
      </form>
    </FormProvider>
  );
}
