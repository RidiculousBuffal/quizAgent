import {GetProp} from "antd";
import {Bubble} from "@ant-design/x";
import {RobotOutlined, UserOutlined} from "@ant-design/icons";
import React from "react";
import {Markdown, MarkdownProps} from "@lobehub/ui";

export interface messageItem {
    key: number|string
    role: string
    content: string
}

function BubbleList({session}: { session: messageItem[] }) {
    const roles: GetProp<typeof Bubble.List, 'roles'> = {
        ai: {
            placement: "start",
            avatar: {
                icon: <RobotOutlined/>,
                style: {background: "#1677ff", color: "#fff"},
            },
        },
        user: {
            placement: "end",
            avatar: {
                icon: <UserOutlined/>
            }
        }
    }
    return <>
        <Bubble.List roles={roles} autoScroll={true} items={session.map((x) => {
            const options: MarkdownProps =
                {
                    allowHtml: true,
                    children: x.content != undefined ? x.content.toString() : '',
                    fullFeaturedCodeBlock: true,
                    headerMultiple: 1,
                    lineHeight: 1,
                    marginMultiple: 1,
                    fontSize: 14,
                    style:{
                        maxWidth:"600px"
                    }
                }
            return {
                key: x.key,
                role: x.role,
                content: <Markdown  {...options}></Markdown>,
                loading: !x.content
            }
        })}></Bubble.List>
    </>
}

export default BubbleList;