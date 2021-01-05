import { FC, useState, useEffect } from 'react'
import type { AppProps } from 'next/app'
import Link from 'next/link'
import s from './Navbar.module.css'
import { Logo, Container } from '@components/ui'
import { Searchbar, UserNav } from '@components/common'
import cn from 'classnames'
import throttle from 'lodash.throttle'
import type { Page } from '@bigcommerce/storefront-data-hooks/api/operations/get-all-pages'


interface Props {
  pageProps: {
    categories?: {
      children: [],
      description: string,
      entityId: number,
      name: string,
      path: string,
      productCount: number
    }[],
    pages?: Page[]
  }
}

const Navbar: FC<Props> = ({pageProps}) => {
  const [hasScrolled, setHasScrolled] = useState(false)
  const {categories} = pageProps
  const handleScroll = () => {
    const offset = 0
    const { scrollTop } = document.documentElement
    const scrolled = scrollTop > offset
    setHasScrolled(scrolled)
  }

  useEffect(() => {
    document.addEventListener('scroll', throttle(handleScroll, 200))
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <div className={cn(s.root, { 'shadow-magical': hasScrolled })}>
      <Container>
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
          <div className="flex flex-1 items-center">
            <Link href="/">
              <a className={s.logo} aria-label="Logo">
                <Logo />
              </a>
            </Link>
            <nav className="space-x-4 ml-6 hidden lg:block">
              {categories?.map(category => category.productCount > 0 
              ? (
                <Link href={`/search${category.path}`}>
                  <a className={s.link}>{category.name}</a>
                </Link>
              )
              : null)}
            </nav>
          </div>

          <div className="flex-1 justify-center hidden lg:flex">
            <Searchbar />
          </div>

          <div className="flex flex-1 justify-end space-x-8">
            <UserNav />
          </div>
        </div>

        <div className="flex pb-4 lg:px-6 lg:hidden">
          <Searchbar id="mobile-search" />
        </div>
      </Container>
    </div>
  )
}

export default Navbar
