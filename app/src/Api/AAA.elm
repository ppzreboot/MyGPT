module Api.AAA exposing (T_result(..), make_decoder)

import Json.Decode

type T_result data
    = Ok data
    | Err String

make_decoder : Json.Decode.Decoder data -> Json.Decode.Decoder (T_result data)
make_decoder decode_ok =
    Json.Decode.field "error" Json.Decode.bool
        |> Json.Decode.andThen
            (\err ->
                if err then
                    Json.Decode.map Err (Json.Decode.field "key" Json.Decode.string)
                else
                    Json.Decode.map Ok (Json.Decode.field "data" decode_ok)
            )
