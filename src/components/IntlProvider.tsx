"use client";

import { NextIntlClientProvider } from "next-intl";
import type { ComponentProps, ReactNode } from "react";

type Messages = ComponentProps<typeof NextIntlClientProvider>["messages"];
export function IntlProvider({ children, locale, messages }: { children: ReactNode; locale: string; messages: Messages }) {
  return <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">{children}</NextIntlClientProvider>;
}
