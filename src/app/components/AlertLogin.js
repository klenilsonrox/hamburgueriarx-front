import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserPlus, LogIn, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function AlertLogin() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="w-[90vw] max-w-md mx-auto shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl font-bold">Bem-vindo!</CardTitle>
              <CardDescription className="text-base sm:text-lg mt-2">
                Para finalizar seu pedido, você precisa ter uma conta
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button asChild size="lg" className="w-full">
                <Link href="/auth/cadastrar" className="flex items-center justify-center bg-red-600 hover:bg-red-700">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Criar nova conta
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Já tem uma conta?
                  </span>
                </div>
              </div>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/auth/entrar" className="flex items-center justify-center">
                  <LogIn className="mr-2 h-5 w-5" />
                  Acessar minha conta
                </Link>
              </Button>
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground">
              Ao criar uma conta, você poderá acompanhar seus pedidos e ter uma experiência personalizada.
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}