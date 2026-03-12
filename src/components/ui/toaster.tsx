"use client";

import Image from "next/image";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "../../components/ui/toast";
import { useToast } from "../../components/ui/use-toast";

import styles from "../scss/Toaster.module.scss";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, src, ...props }) {
        return (
          <Toast key={id} {...props} className={styles.Toast}>
            <div className={styles.toastContainer}>
              <div className={styles.imageContainer}>
                <Image
                  alt=""
                  src={src}
                  width={48}
                  height={48}
                  className={styles.image}
                />
              </div>
              {title && (
                <ToastTitle className={styles.title}>{title}</ToastTitle>
              )}
              {description && (
                <ToastDescription className={styles.description}>
                  {description}
                </ToastDescription>
              )}
              <div className="flex gap-2">
                <Image
                  src="/phone(black).svg"
                  width={33}
                  height={33}
                  alt="phone"
                />
                <p className="font-bold text-primary-text tracking-[-0.8px] ">
                  (805) 524 - 5569
                </p>
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport className={styles.viewport} />
    </ToastProvider>
  );
}
