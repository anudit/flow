import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { Providers } from "./providers";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: {
		default: "Flow",
		template: "%s | Flow",
	},
	description: "Never miss a train of thought.",
	openGraph: {
		title: "Flow",
		description:
			"Never miss a train of thought.",
		url: "https://flow.anudit.dev",
		siteName: "flow.anudit.dev",
		images: [
			{
				url: "https://flow.anudit.dev/og.png",
				width: 1920,
				height: 1080,
			},
		],
		locale: "en-US",
		type: "website",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	twitter: {
		title: "Flow",
		card: "summary_large_image",
	},
	icons: {
		icon: "/icon.svg",
		shortcut: "/icon.svg",
	},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
		<Providers>
      		<body className={inter.className}>{children}</body>
        </Providers>
    </html>
  )
}
