import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { Form, Button } from 'react-bootstrap'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'
import * as yup from 'yup'

import { RequestSigninData } from '../../types/form'
import * as api from '../../api'
import { supabase } from '../../lib/supabase'

const schema = yup.object({
  email: yup.string().email('形式を確認してください').required('必須項目です'),
  password: yup.string().required('必須項目です'),
})

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const { user } = await supabase.auth.api.getUserByCookie(req)
  if (user) {
    return {
      props: {},
      redirect: {
        destination: '/',
      },
    }
  }
  return { props: {} }
}

const Signin: NextPage<Props> = () => {
  const { push } = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestSigninData>({
    resolver: yupResolver(schema),
  })
  const onSubmit: SubmitHandler<RequestSigninData> = async (data) => {
    try {
      await api.auth.signin(data)
      await push('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Head>
        <title>Supabase登録テスト | サインイン</title>
      </Head>
      <div className="container py-5">
        <div className="mb-5">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>メールアドレス</Form.Label>
              <Form.Control type="email" {...register('email')} />
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => (
                  <p className="mt-1 text-danger">{message}</p>
                )}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>パスワード</Form.Label>
              <Form.Control type="password" {...register('password')} />
              <ErrorMessage
                errors={errors}
                name="password"
                render={({ message }) => (
                  <p className="mt-1 text-danger">{message}</p>
                )}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              ログイン
            </Button>
          </Form>
        </div>
        <p className="text-muted">
          アカウントがない方は
          <Link href="/signup" passHref>
            <a>こちら</a>
          </Link>
          から
        </p>
      </div>
    </div>
  )
}

export default Signin
