import type { NextPage } from 'next'
import Head from 'next/head'
import { Form, Button } from 'react-bootstrap'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'
import * as yup from 'yup'

import { RequestSignupData } from '../../types/form'
import * as api from '../../api'
import Link from 'next/link'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { supabase } from '../../lib/supabase'

const schema = yup.object({
  email: yup.string().email('形式を確認してください').required('必須項目です'),
  password: yup.string().required('必須項目です'),
  company_name: yup.string().required('必須項目です'),
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

const Signup: NextPage<Props> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RequestSignupData>({
    resolver: yupResolver(schema),
  })
  const onSubmit: SubmitHandler<RequestSignupData> = async (data) => {
    try {
      await api.auth.signup(data)
      alert('確認メールを送信しました')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <Head>
        <title>Supabase登録テスト | サインアップ</title>
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
            <Form.Group className="mb-4" controlId="company_name">
              <Form.Label>会社名</Form.Label>
              <Form.Control type="text" {...register('company_name')} />
              <ErrorMessage
                errors={errors}
                name="company_name"
                render={({ message }) => (
                  <p className="mt-1 text-danger">{message}</p>
                )}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              登録する
            </Button>
          </Form>
        </div>
        <p className="text-muted">
          ログインは
          <Link href="/signin" passHref>
            <a>こちら</a>
          </Link>
          から
        </p>
      </div>
    </div>
  )
}

export default Signup
