import { getToken } from "@/app/actions/getToken"
import Container from "@/app/components/Container"
import MeusPedidos from "@/app/components/MeusPedidos"


const page = () => {    
    return (
        <Container>
          <MeusPedidos />
        </Container>
    )
}

export default page
