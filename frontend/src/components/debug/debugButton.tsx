import { useState } from 'react'
import { useUserStore } from "../../store/user/UserStore.ts";

export const DebugFloater = () => {
    const [expanded, setExpanded] = useState(false)

    if (import.meta.env.MODE !== 'development') return null

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 9999,
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '12px 16px',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                fontSize: '14px',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                transition: 'all 0.3s ease',
                maxWidth: expanded ? '400px' : '200px'
            }}
            onClick={(e) => {
                // 阻止事件冒泡避免与内部元素冲突
                e.stopPropagation()
                setExpanded(!expanded)
            }}
        >
            <div style={{
                width: '8px',
                height: '8px',
                background: '#00ff88',
                borderRadius: '50%',
                flexShrink: 0,
                transform: expanded ? 'scale(1.2)' : 'none'
            }}/>
            <DebugContent expanded={expanded} />
            <div style={{
                marginLeft: '8px',
                transform: expanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s ease'
            }}>
                ▼
            </div>
        </div>
    )
}

const DebugContent = ({ expanded }: { expanded: boolean }) => {
    const saToken = useUserStore(state => state.saToken)
    const isSignedIn = useUserStore(state => state.isSignedIn)

    const copyToken = (e: React.MouseEvent) => {
        e.stopPropagation() // 阻止触发外层点击事件
        if (saToken) {
            navigator.clipboard.writeText(saToken)
            alert('Token已复制')
        }
    }

    return (
        <div style={{
            lineHeight: 1.4,
            width: "100%",
            overflow: 'hidden'
        }}>
            <div style={{ marginBottom: '4px' }}>
                Auth Status: {isSignedIn ?
                <span style={{ color: '#00ff88' }}>SIGNED IN</span> :
                <span style={{ color: '#ff4444' }}>NOT SIGNED</span>}
            </div>
            {saToken && (
                <div
                    onClick={copyToken}
                    style={{
                        cursor: 'copy',
                        opacity: 0.8,
                        transition: 'opacity 0.3s ease',
                        wordBreak: 'break-all',
                        maxHeight: expanded ? 'none' : '20px',
                        overflow: 'hidden'
                    }}
                >
                    SA Token: {expanded ?
                    <span>{saToken}</span> :
                    <span>{saToken.slice(0, 8)}...</span>
                }
                </div>
            )}
        </div>
    )
}