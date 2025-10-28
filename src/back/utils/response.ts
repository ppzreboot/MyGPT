import { API_ERROR } from '@/front-back/api/error'

export
function respond_error(error: API_ERROR) {
    return Response.json({ error })
}

export
function respond_success(data: unknown) {
    return Response.json({
        error: null,
        data,
    })
}
