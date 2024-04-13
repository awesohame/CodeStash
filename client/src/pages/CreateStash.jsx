import { CopyBlock } from "react-code-blocks";

export default function CreateStash() {
    return (
        <div>
            <CopyBlock
                text={`import React from 'react'
import logoName from '../assets/logoName.png'
import SolidBtn from '../components/buttons/SolidBtn'
import { FaCirclePlus } from "react-icons/fa6";
`}
                language="jsx"
                showLineNumbers={true}
                theme="dracula"
            />
        </div>
    )
}
