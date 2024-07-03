"use server"

import { log } from "console";


export async function GetRAGResponse(namespace : string, question: string) {
        const response = await fetch(process.env.LABIRA_RAG_API + "/v1/tanyalabira", {
                method: "POST",
                headers: {
                        "content-type": "application/json"
                },
                body: JSON.stringify(
                        {
                                "namespace" : namespace,
                                "question" : question,
                                "index_name": process.env.LABIRA_RAG_INDEX_NAME,
                                "session_id" : "salkslajwijlalakwjoijaknd" // ini nanti buat auth sessionnya
                        }
                )
        })
        const data = await response.json();
        return data;

}


export async function GetUserSession(){
        const response = await fetch(process.env.LABIRA_RAG_API + "/v1/getsession", {
                method: "GET",
                headers:{
                        "content-type": "application/json",
                },
        })
        const data = await response.json();
        log()
        // return data;
        return {
                props: {
                        userSession: data.id || '',
                },
        }
}