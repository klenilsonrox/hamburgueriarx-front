import Container from '@/app/components/Container'
import Produto from '@/app/components/Produto'
import React from 'react'

const page = ({params}) => {
  const {slug}= params
  return (
    <Container>
      <Produto slug={slug}/>
    </Container>
  )
}

export default page
