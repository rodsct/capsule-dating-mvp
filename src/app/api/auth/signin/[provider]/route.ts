import { type NextRequest } from 'next/server'
import { signIn } from '@/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider?: string }> }
) {
  const provider = (await params).provider
  const callback = req.nextUrl.searchParams.get('callback')
  return signIn(provider, callback ? { redirectTo: callback } : undefined)
}
