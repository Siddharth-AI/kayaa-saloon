"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { getUserProfile, initializeAuth, logout } from "@/store/slices/authSlice";
import { loadUserCart, syncCartOnLogin } from "@/store/slices/cartSlice";

export default function LoginHandler() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { selectedLocationUuid } = useAppSelector((state) => state.services);
  const {
    tempToken,
    alreadyRegistered,
    skipProfile,
    isLoadingProfile,
    isInitialized,
  } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isInitialized && tempToken && !user && !isLoadingProfile) {
      console.log("🔍 Validating token on app start");
      dispatch(getUserProfile()).then((result) => {
        console.log("📊 Profile validation result:", result.type);
        if (result.type === getUserProfile.rejected.type) {
          console.log("❌ Token invalid, logging out");
          dispatch(logout());
        }
      });
    }
  }, [isInitialized, dispatch, tempToken, user, isLoadingProfile]);

  useEffect(() => {
    if (isInitialized && tempToken && !user && !isLoadingProfile && alreadyRegistered) {
      dispatch(getUserProfile());
    }
  }, [isInitialized, tempToken, user, isLoadingProfile, alreadyRegistered, dispatch]);

  useEffect(() => {
    if (
      tempToken &&
      alreadyRegistered &&
      skipProfile &&
      !user &&
      !isLoadingProfile
    ) {
      dispatch(getUserProfile());
    }
  }, [
    tempToken,
    alreadyRegistered,
    skipProfile,
    user,
    isLoadingProfile,
    dispatch,
  ]);

  useEffect(() => {
    if (user && selectedLocationUuid) {
      const guestCart =
        typeof window !== "undefined"
          ? localStorage.getItem("guestCart")
          : null;

      if (guestCart && JSON.parse(guestCart).length > 0) {
        dispatch(syncCartOnLogin(user, selectedLocationUuid));
      } else {
        dispatch(loadUserCart(user, selectedLocationUuid));
      }
    }
  }, [user, selectedLocationUuid, dispatch]);

  return null;
}
