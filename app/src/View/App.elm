module View.App exposing (app_view)

import Type
import Html
import Html.Attributes

app_view : Type.T_model -> Html.Html Type.T_msg
app_view model =
    Html.div [] (
        case model of
            Type.Loading__auth_status -> [Html.text "Loading Auth Status"]
            Type.Http_error__auth_status err_txt -> [Html.text err_txt]
            Type.Signed_in -> [Html.text "Signed in"]
            Type.Guest sign_in_list ->
                    (List.map
                        (\item ->
                            Html.a [ Html.Attributes.href item.link ]
                                [ Html.text item.key ]
                        )
                        sign_in_list
                    )
    )
