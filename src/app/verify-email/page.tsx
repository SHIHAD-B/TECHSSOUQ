'use client'

import { useMemo, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { MailCheck, ExternalLink, RefreshCw, ArrowLeft } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { useToast } from '@/contexts/ToastContext'

function VerifyEmailContent() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const { showToast } = useToast()
	const email = searchParams.get('email') || ''
	const gmailHref = email
		? `https://mail.google.com/mail/u/?authuser=${encodeURIComponent(email)}`
		: 'https://mail.google.com'
	const [resending, setResending] = useState(false)
	const supabase = useMemo(() => createSupabaseClient(), [])

	const handleResend = async () => {
		if (!email) {
			showToast('Missing email to resend verification.', 'warning')
			return
		}
		try {
			setResending(true)
			const { error } = await supabase.auth.resend({ type: 'signup', email })
			if (error) {
				showToast(error.message || 'Could not resend verification email.', 'error')
			} else {
				showToast('Verification email resent. Please check your inbox.', 'success')
			}
		} catch (err) {
			showToast('Unexpected error while resending email.', 'error')
		} finally {
			setResending(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				<div className="mb-6">
					<Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
						<ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
					</Link>
				</div>

				<div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
					<div className="mx-auto mb-4 h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center">
						<MailCheck className="w-8 h-8 text-emerald-500" />
					</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
					<p className="text-gray-600 mb-6">
						{email ? (
							<>
								We sent a verification link to <span className="font-semibold text-gray-900">{email}</span>.
							</>
						) : (
							'We sent a verification link to your email address.'
						)}
					</p>

					<div className="flex flex-col gap-3">
						<a
							href={gmailHref}
							target="_blank"
							rel="noopener noreferrer"
							className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
						>
							Open Gmail <ExternalLink className="w-4 h-4" />
						</a>
						<button
							onClick={handleResend}
							disabled={resending}
							className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
						>
							{resending ? (
								<>
									<RefreshCw className="w-4 h-4 animate-spin" />
									Resending...
								</>
							) : (
								<>
									<RefreshCw className="w-4 h-4" />
									Resend verification email
								</>
							)}
						</button>
						<Link
							href="/sign-in"
							className="w-full inline-flex items-center justify-center gap-2 text-amber-600 hover:text-amber-700 font-semibold py-3 px-4 rounded-lg transition-colors"
						>
							Continue to Sign In
						</Link>
						<Link
							href="/forgot-password"
							className="w-full inline-flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
						>
							Forgot password?
						</Link>
					</div>

					<p className="text-xs text-gray-500 mt-6">
						Having trouble? Check your spam folder or try another email app.
					</p>
				</div>
			</div>
		</div>
	)
}

export default function VerifyEmailPage() {
	return (
		<Suspense fallback={
			<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
						<div className="mx-auto mb-4 h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center">
							<RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
						</div>
						<h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
						<p className="text-gray-600">Please wait while we load the verification page.</p>
					</div>
				</div>
			</div>
		}>
			<VerifyEmailContent />
		</Suspense>
	)
}


