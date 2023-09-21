import { useEffect, useState } from 'react'
import { API } from 'aws-amplify'
import { Inter } from 'next/font/google'
import type { GraphQLResult } from '@aws-amplify/api'
import type { ListTodosQuery } from '@/API'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [todos, setTodos] = useState<ListTodosQuery['listTodos'] | null>(null)

  useEffect(() => {
    const listTodos = async () => {
      const { data } = (await API.graphql<ListTodosQuery>({
        query: /* GraphQL */ `
          query ListTodos {
            listTodos {
              items {
                id
                name
              }
            }
          }
        `,
      })) as GraphQLResult<ListTodosQuery>
      setTodos(data?.listTodos)
    }
    listTodos()
  }, [])

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <code className="font-mono font-bold">
            {JSON.stringify(todos || {}, null, 2)}
          </code>
        </p>
        <button
          className="border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
          onClick={() => {}}
        >
          Reload
        </button>
      </div>
    </main>
  )
}
