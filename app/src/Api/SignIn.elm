module Api.SignIn exposing (retrieve__auth_status, I_oauth_login_item, I_auth_status(..))

import Api.Base
import Http
import Json.Decode

type alias I_oauth_login_item =
    { key: String
    , link: String
    }

type I_auth_status
    = Signed_in
    | Guest (List I_oauth_login_item)

decoder__auth_status : Json.Decode.Decoder I_auth_status
decoder__auth_status =
    Json.Decode.field "signed_in" Json.Decode.bool
    |> Json.Decode.andThen
        (\signed_in ->
            if signed_in then
                Json.Decode.succeed Signed_in
            else (
                Json.Decode.field "oauth_list" (
                    Json.Decode.list (
                        Json.Decode.map2 I_oauth_login_item
                            (Json.Decode.field "key" Json.Decode.string)
                            (Json.Decode.field "link" Json.Decode.string)
                    )
                )
                |>
                    Json.Decode.andThen
                        (\list -> Json.Decode.succeed (Guest list))
            )
        )

retrieve__auth_status : ((Result Http.Error (Api.Base.T_result I_auth_status)) -> msg) -> Cmd msg
retrieve__auth_status make_msg =
    Http.get
        { url = "/api/auth/has-login"
        , expect = Http.expectJson make_msg (Api.Base.make_decoder decoder__auth_status)
        }
