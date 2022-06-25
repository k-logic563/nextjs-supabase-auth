import { useEffect } from 'react'
import type {
  NextPage,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Button } from 'react-bootstrap'

import { supabase } from '../lib/supabase'
import * as api from '../api'

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const { user } = await supabase.auth.api.getUserByCookie(req)
  if (!user) {
    return {
      props: {},
      redirect: {
        destination: '/signin',
      },
    }
  }
  return { props: { user } }
}

const Home: NextPage<Props> = ({ user }) => {
  const { push } = useRouter()

  const handleClickSignout = async () => {
    await api.auth.signout()
    await push('/signin')
  }

  return (
    <div>
      <Head>
        <title>Supabase登録テスト</title>
      </Head>
      <div className="container py-5">
        <div className="mb-5">
          <p>Email: {user?.email}</p>
        </div>
        <Button variant="primary" type="button" onClick={handleClickSignout}>
          ログアウト
        </Button>
      </div>
    </div>
  )
}

export default Home
