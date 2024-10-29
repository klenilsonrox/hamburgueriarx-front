
'use server'
import { revalidatePath } from 'next/cache'
import {cookies} from 'next/headers'

export const logout = () => {
   cookies().delete('token')
   revalidatePath('/cardapio')

}