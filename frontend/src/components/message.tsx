import React, {FC, useEffect,} from "react"

import {message,} from "antd";
import {MESSAGE_EVENT_NAME} from './utils/antdMessage'


type Props = object

const Message: FC<Props> = props => {

    const [api, contextHolder] = message.useMessage();

    useEffect(() => {
        const bindEvent = (e: CustomEvent | any) => {
            const func = e?.detail?.type || 'info'
            // eslint-disable-next-line no-unsafe-optional-chaining
            const {content, duration, onClose} = e.detail?.params
            // @ts-expect-error 全局替换antd message 用,不然不方便在ts文件中做提示
            api[func](content, duration, onClose)
        }

        window.addEventListener(MESSAGE_EVENT_NAME, bindEvent)

        return () => {
            window.removeEventListener(MESSAGE_EVENT_NAME, bindEvent)
        }
    }, [api])

    return (
        <>
            {contextHolder}
        </>
    )
}

export default Message