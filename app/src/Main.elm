module Main exposing (main)

import Browser
import Html
import Html.Attributes
import Http

import Api.AAA
import Api.SignIn
import Platform.Cmd as Cmd

type T_model
    = Loading__auth_status
    | Http_error__auth_status String
    | Guest (List Api.SignIn.I_oauth_login_item)
    | Signed_in

type T_api_response
    = Has_login (Result Http.Error (Api.AAA.T_result Api.SignIn.I_auth_status))

type T_msg
    = Got_api_response T_api_response

init : () -> (T_model, Cmd T_msg)
init _ =
    ( Loading__auth_status
    , Api.SignIn.retrieve__auth_status (\result -> Got_api_response (Has_login result))
    )

update : T_msg -> T_model -> (T_model, Cmd T_msg)
update msg _ =
    case msg of
        Got_api_response response -> -- 处理 api 请求
            case response of
                Has_login http_result -> -- api: 检查登录状态
                    case http_result of
                        Err reason -> -- 处理 http error
                            case reason of
                                Http.BadBody parse_err_msg ->
                                    ( Http_error__auth_status ("error on parse http body" ++ parse_err_msg)
                                    , Cmd.none
                                    )
                                _ ->
                                    ( Http_error__auth_status "other network error"
                                    , Cmd.none
                                    )
                        Ok api_result ->
                            case api_result of
                                Api.AAA.Err _ -> -- 处理 api error
                                    ( Http_error__auth_status "error in server"
                                    , Cmd.none)
                                Api.AAA.Ok status ->
                                    case status of
                                        Api.SignIn.Signed_in -> -- 正常响应：已登录
                                            (Signed_in, Cmd.none)
                                        Api.SignIn.Guest oauth_list -> -- 正常响应：未登录
                                            (Guest oauth_list, Cmd.none)

view : T_model -> Html.Html T_msg
view model =
    Html.div [] (
        case model of
            Loading__auth_status -> [Html.text "Loading Auth Status"]
            Http_error__auth_status err_txt -> [Html.text err_txt]
            Signed_in -> [Html.text "Signed in"]
            Guest sign_in_list ->
                    (List.map
                        (\item ->
                            Html.a [ Html.Attributes.href item.link ]
                                [ Html.text item.key ]
                        )
                        sign_in_list
                    )
    )


main : Program () T_model T_msg
main =
    Browser.element
        { init = init
        , update = update
        , view = view
        , subscriptions = (\_ -> Sub.none)
        }