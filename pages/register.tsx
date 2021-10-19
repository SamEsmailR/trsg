import { useState, useEffect } from 'react'

import { useApi } from '@hooks'
import toast from 'react-hot-toast'
import cookie from 'js-cookie'

import { Disclosure } from '@headlessui/react'
import { Button, Nav, Input, Select } from '@components'
import { useRouter } from 'next/router'
import * as timeago from 'timeago.js'


export default function Auth() {
	const [form, setForm] = useState({ email: null, password: null, mfa: null })
	const [loading, setLoading] = useState(false)
	const [mfa, setMfa] = useState(false)
    const [user, setUser] = useState<any>(null)

    const [createUserForm, setCreateUserForm] = useState<any>({
		name: '',
		email: '',
		password: '',
		
	})
    const router = useRouter()

	const hydrate = async () => {
		setUser(await useApi(`/api/auth`))
        useEffect(() => {
            hydrate()
        }, [])

	async function register() {
		await toast.promise(useApi('/api/auth', 'POST', { action: 'create_user', id: '0', data: createUserForm }), {
			loading: 'Please wait...',
			success: () => {
				setCreateUserForm({ name: '', email: '', password: '', admin: false, show: false })
				hydrate()
				return 'Created successfully'
			},
			error: 'Error, try again',
		})
	}

	return (
		<div className='grid place-items-center min-h-screen'>
			<div className='w-96 p-7'>
				{mfa ? (
					<div className='flex flex-col gap-5'>
						<p>Enter the one time password from your authenticator app</p>
						<Input
							type='text'
							disabled={loading}
							label='Code'
							onChange={({ target }) => setForm({ ...form, mfa: target.value })}
						/>
					</div>
				) : (
					<>
						<Input
							type='email'
							disabled={loading}
							label='Email'
							onChange={({ target }) => setForm({ ...form, email: target.value })}
						/>
						<Input
							type='password'
							disabled={loading}
							label='Password'
							onChange={({ target }) => setForm({ ...form, password: target.value })}
						/>
					</>
				)}
				<div className='mt-6'>
					<Button
						className='w-full'
						loading={loading}
						disabled={loading || !form.email || !form.password}
						onClick={() => register()}
					>
						register
					</Button>
				</div>
			</div>
		</div>
	)
}
}
