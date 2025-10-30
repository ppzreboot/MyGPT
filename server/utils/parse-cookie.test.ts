import { assertEquals } from 'jsr:@std/assert'
import { parse_cookie } from './parse-cookie.ts'

Deno.test('Utils - Parse Cookie - normal work', () => {
    const cookie_str = 'name=ppz;year=5;tel=110'
    const cookie = parse_cookie(cookie_str)
    assertEquals(Object.entries(cookie).length, 3)
    assertEquals(cookie.name, 'ppz')
    assertEquals(cookie.year, '5')
    assertEquals(cookie.tel, '110')
})

Deno.test('Utils - Parse Cookie - spaces', () => {
    const cookie_str = ' name = ppz  ; year =5;tel=110'
    const cookie = parse_cookie(cookie_str)
    assertEquals(Object.entries(cookie).length, 3)
    assertEquals(cookie.name, 'ppz')
    assertEquals(cookie.year, '5')
    assertEquals(cookie.tel, '110')
})

function cookie_length(cookie: Record<string, string>) {
    return Object.entries(cookie).length
}

Deno.test('Utils - Parse Cookie - no cookie', () => {
    assertEquals(0, cookie_length(parse_cookie(' ; =')))
    assertEquals(0, cookie_length(parse_cookie('; ')))
    assertEquals(0, cookie_length(parse_cookie('abc')))
    assertEquals(0, cookie_length(parse_cookie(';haha')))
    assertEquals(0, cookie_length(parse_cookie('ldk?')))
    assertEquals(0, cookie_length(parse_cookie('= l;')))
    assertEquals(0, cookie_length(parse_cookie('!@#$%abc')))
    assertEquals(0, cookie_length(parse_cookie('=abc; keyobly; ; =; ==')))
})

Deno.test('Utils - Parse Cookie - ODD', () => {
    const cookie1 = parse_cookie('l==    ;?')
    assertEquals(1, cookie_length(cookie1))
    assertEquals(cookie1.l, '=')

    const cookie2 = parse_cookie('l=    ;?')
    assertEquals(1, cookie_length(cookie2))
    assertEquals(cookie2.l, '')

    const cookie3 = parse_cookie('token=abc=123==; x==; y===;')
    assertEquals(3, cookie_length(cookie3))
    assertEquals(cookie3.token, 'abc=123==')
    assertEquals(cookie3.x, '=')
    assertEquals(cookie3.y, '==')

    const cookie4 = parse_cookie('user=小明; emoji=😀🔥')
    assertEquals(2, cookie_length(cookie4))
    assertEquals(cookie4.user, '小明')
    assertEquals(cookie4.emoji, '😀🔥')

    const cookie5 = parse_cookie('quoted="hello, world"; spaced=" a b c "')
    assertEquals(2, cookie_length(cookie5))
    assertEquals(cookie5.quoted, '"hello, world"')
    assertEquals(cookie5.spaced, '" a b c "')
})
