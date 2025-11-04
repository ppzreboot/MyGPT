module Api.SignIn exposing (retrieve__has_signin)

import Api.AAA
import Http
import Json.Decode

decoder__has_login : Json.Decode.Decoder Bool
decoder__has_login =
    Json.Decode.bool

retrieve__has_signin : ((Result Http.Error (Api.AAA.T_result Bool)) -> msg) -> Cmd msg
retrieve__has_signin make_msg =
    Http.get
        { url = "/api/auth/has-login"
        , expect = Http.expectJson make_msg (Api.AAA.make_decoder decoder__has_login)
        }
