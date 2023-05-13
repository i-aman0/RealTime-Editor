import { init } from 'events';
import React from 'react'
import { useEffect } from 'react'
import Codemirror from 'codemirror'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/darcula.css';
// import 'codemirror/theme/monokai.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/lib/codemirror.css';
import { useRef } from 'react';
import ACTIONS from '../Actions';


const Editor = ({socketRef, roomId, onCodeChange}) => {
    const editorRef = useRef(null);
    useEffect(() => {
        async function init(){
            editorRef.current = Codemirror.fromTextArea(document.getElementById('realtimeEditor'), {
                mode: {name: 'javascript', json: true},
                theme: 'darcula',
                autoCloseTags : true,
                autoCloseBrackets: true,
                lineNumbers : true,
            });

            editorRef.current.on('change', (instance, changes) => {
                const {origin} = changes; 
                const code = instance.getValue(); // gets the value of the event trigerred on the current instance
                onCodeChange(code);
                if(origin !== 'setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });

            // writes the value dynamically inside the editor
            // editorRef.current.setValue(`console.log('hello')`);
        }
        init();
    }, []);

    useEffect(() => {
        if(socketRef.current){
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
                if(code !== null){
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

  return <textarea id="realtimeEditor"></textarea>
};

export default Editor;
