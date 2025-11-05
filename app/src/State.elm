module State exposing (init, update)

import Http

import Api.Base
import Api.SignIn
import Platform.Cmd as Cmd
import Type

init : () -> (Type.T_model, Cmd Type.T_msg)
init _ =
    ( Type.Loading__auth_status
    , Api.SignIn.retrieve__auth_status (\result -> Type.Got_api_response (Type.Has_login result))
    )

update : Type.T_msg -> Type.T_model -> (Type.T_model, Cmd Type.T_msg)
update msg _ =
    case msg of
        Type.Got_api_response response -> -- 处理 api 请求
            case response of
                Type.Has_login http_result -> -- api: 检查登录状态
                    case http_result of
                        Err reason -> -- 处理 http error
                            case reason of
                                Http.BadBody parse_err_msg ->
                                    ( Type.Http_error__auth_status ("error on parse http body" ++ parse_err_msg)
                                    , Cmd.none
                                    )
                                _ ->
                                    ( Type.Http_error__auth_status "other network error"
                                    , Cmd.none
                                    )
                        Ok api_result ->
                            case api_result of
                                Api.Base.Err _ -> -- 处理 api error
                                    ( Type.Http_error__auth_status "error in server"
                                    , Cmd.none)
                                Api.Base.Ok status ->
                                    case status of
                                        Api.SignIn.Signed_in -> -- 正常响应：已登录
                                            (Type.Signed_in, Cmd.none)
                                        Api.SignIn.Guest oauth_list -> -- 正常响应：未登录
                                            (Type.Guest oauth_list, Cmd.none)