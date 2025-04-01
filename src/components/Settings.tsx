"use client";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/api-services/api-services";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "./ui/spinner";

const PinSchema = z
  .object({
    pin: z
      .string()
      .length(4, "PIN must be exactly 4 characters")
      .regex(/^\d+$/, "PIN must contain only numbers"),
    confirmPin: z.string(),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "PINs don't match",
    path: ["confirmPin"],
  });

const PasswordSchema = z
  .object({
    password: z
      .string()
      .min(5, "Password must be at least 5 characters")
      .max(50, "Password cannot exceed 50 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PinFormData = z.infer<typeof PinSchema>;
type PasswordFormData = z.infer<typeof PasswordSchema>;

export default function Settings() {
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const pinForm = useForm<PinFormData>({
    resolver: zodResolver(PinSchema),
    defaultValues: {
      pin: "",
      confirmPin: "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onPinSubmit = async (data: PinFormData) => {
    try {
      setIsUpdatingPin(true);
      await api.put("/users/me/update-pin", { pin: data.pin });
      toast.success("PIN updated successfully");
      pinForm.reset();
    } catch (error) {
      toast.error("Failed to update PIN");
    } finally {
      setIsUpdatingPin(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsUpdatingPassword(true);
      await api.put("/users/me/update-password", {
        password: data.password,
      });
      toast.success("Password updated successfully");
      passwordForm.reset();
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="space-y-8">
        {/* PIN Update Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Update PIN</h3>
          <form
            onSubmit={pinForm.handleSubmit(onPinSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New PIN
              </label>
              <input
                type="password"
                {...pinForm.register("pin")}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter new PIN"
              />
              {pinForm.formState.errors.pin && (
                <p className="text-red-500 text-sm mt-1">
                  {pinForm.formState.errors.pin.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm PIN
              </label>
              <input
                type="password"
                {...pinForm.register("confirmPin")}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Confirm new PIN"
              />
              {pinForm.formState.errors.confirmPin && (
                <p className="text-red-500 text-sm mt-1">
                  {pinForm.formState.errors.confirmPin.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isUpdatingPin}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isUpdatingPin ? (
                <>
                  <Spinner className="h-5 w-5" />
                  <span>Updating PIN...</span>
                </>
              ) : (
                "Update PIN"
              )}
            </button>
          </form>
        </div>

        {/* Password Update Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Update Password</h3>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                {...passwordForm.register("password")}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter new password"
              />
              {passwordForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                {...passwordForm.register("confirmPassword")}
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Confirm new password"
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
            >
              {isUpdatingPassword ? (
                <>
                  <Spinner className="h-5 w-5" />
                  <span>Updating Password...</span>
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
