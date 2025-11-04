module Main exposing (main)

import Browser
import Html exposing (Html)
import Http

import Api.AAA
import Api.SignIn

type T_model
    = Loading__session_token
    | Guest
    | Signed_in

type T_api_response
    = Has_login (Result Http.Error (Api.AAA.T_result Bool))

type T_msg
    = Got_api_response T_api_response

init : () -> (T_model, Cmd T_msg)
init _ =
    ( Loading__session_token
    , Api.SignIn.retrieve__has_signin (\result -> Got_api_response (Has_login result))
    )

update : T_msg -> T_model -> (T_model, Cmd T_msg)
update msg _ =
    case msg of
        Got_api_response response -> -- 处理 api 请求
            case response of
                Has_login http_result -> -- api: 检查登录状态
                    case http_result of
                        Err _ -> -- 处理 http error
                            (Guest, Cmd.none)
                        Ok api_result ->
                            case api_result of
                                Api.AAA.Err _ -> -- 处理 api error
                                    (Guest, Cmd.none)
                                Api.AAA.Ok has_login ->
                                    if has_login then -- 正常响应：已登录
                                        (Signed_in, Cmd.none)
                                    else -- 正常响应：未登录
                                        (Guest, Cmd.none)

view : T_model -> Html T_msg
view model =
    Html.div [] [
        Html.text (
            case model of
                Loading__session_token -> "Loading Session"
                Signed_in -> "Signed in"
                Guest -> "Guest"
        )
    ]


main : Program () T_model T_msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = (\_ -> Sub.none)
        }