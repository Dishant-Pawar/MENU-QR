import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { getServiceSupabase } from "~/server/supabase/supabaseClient";

export const userRouter = createTRPCRouter({
  deleteAccount: privateProcedure
    .input(
      z.object({
        confirmEmail: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the email matches the logged-in user
      const userEmail = ctx.user.email;
      
      if (input.confirmEmail !== userEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email does not match your account email",
        });
      }

      const userId = ctx.user.id;

      try {
        // Delete user from auth.users (this will cascade to profiles, menus, etc. due to foreign key constraints)
        const { error: authError } = await getServiceSupabase()
          .auth.admin
          .deleteUser(userId);

        if (authError) {
          console.error("Error deleting user from auth:", authError);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete account. Please try again or contact support.",
          });
        }

        return { success: true, message: "Account deleted successfully" };
      } catch (error) {
        console.error("Error in deleteAccount mutation:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while deleting your account",
        });
      }
    }),
});
