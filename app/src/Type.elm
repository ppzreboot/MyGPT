module Type exposing (..)

import Api.Base
import Api.SignIn
import Http

type T_model
    = Loading__auth_status
    | Http_error__auth_status String
    | Guest (List Api.SignIn.I_oauth_login_item)
    | Signed_in

type T_api_response
    = Has_login (Result Http.Error (Api.Base.T_result Api.SignIn.I_auth_status))

type T_msg
    = Got_api_response T_api_response
