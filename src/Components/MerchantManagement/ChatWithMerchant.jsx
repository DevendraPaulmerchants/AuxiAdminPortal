// -----------------------------
import React, { useEffect, useState } from 'react';
import style from "../Admin/Admin.module.css";
import style1 from "./Merchants.module.css";
import { useParams } from 'react-router-dom';
import { useContextData } from '../Context/Context';
import { APIPATH } from '../apiPath/apipath';

function ChatWithMerchant() {
    const { id } = useParams();
    const { token } = useContextData();
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJqNnBpanV1RWtaNTZNWEdUY3RGRXl0NTJTOHBpTmlGdHhvelNqVmxzU0pQaVU2NnAzK1l4R1VLUldSM2txY0RLNElzVEFoWXllTjJPTVRoNVVPQURyM1UzeG9qdWpseElNRk41RkM0YmNyR0Z4eE1oREtSVkwyTlVFYkZIN01Rd0ljU21SRk5UT3ZWdTVBZWtiUFJNYjRwK1JKajFvQ09NdVp5R0p0YWdBblBxTU1XNUVNcFQ1QVFCaG5QU3ZoWndWYldTeXdFQjd2eDRsK3VJN0xZcGZNQy9wRjZ5c2xYckk4ZUtVU1NoZ3RDU05hSWhwV1Zvd1haNlNEYXZyVGs1IiwiaWF0IjoxNzQxNjc1NTc1fQ.ae8qyf5iPWl-ZZ_UTmOrHaA-aHQLtSiLBsYam-UtjiU";
    const [chatDetails, setChatDetails] = useState(null);
    const [comment1, setComment1] = useState("");
    const [lastCommentId, setLastCommentId] = useState("");
    const [imagePath, setImagePath] = useState("")
    const [previewImage, setPreviewImage] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSend, setIsLoadingSend] = useState(false);

    const getChatDetails = () => {
        setIsLoading(true);
        fetch(`${APIPATH}/api/v1/admin/credit/?id=${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "Application/json"
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setChatDetails(data.data);
                getLastReplyId(data.data);
            })
            .catch(err => console.log(err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        getChatDetails();
    }, [id]);

    function getLastReplyId(comments) {
        console.log("inside function", comments)
        let lastReplyId = null;

        function traverseReplies(replies) {
            for (const reply of replies) {
                lastReplyId = reply.id;
                if (reply.replies && reply.replies.length > 0) {
                    traverseReplies(reply.replies);
                }
            }
        }

        for (const comment of comments) {
            if (comment.replies && comment.replies.length > 0) {
                traverseReplies(comment.replies);
            }
        }
        setLastCommentId(lastReplyId);
        return lastReplyId;
    }

    const renderReplies = (replies) => {
        return replies.map((reply, index) => {
            return (
                <div key={index} onClick={() => {
                    console.log(reply.id)
                }}>
                    <h3>{reply.comment_text}{" "}</h3>
                    <span><sub>{reply.commented_by} ({reply?.created_at.split("T")[0]},{" "}
                        {reply?.created_at.split("T")[1].split(".")[0]} )</sub></span>
                    {reply?.attachment_url !== null &&
                        <div className={style.replied_image}>
                            <img src={reply.attachment_url} alt='replied attachetment' />
                        </div>
                    }
                    {reply.replies && reply.replies.length > 0 && renderReplies(reply.replies)}
                </div>
            );
        });
    };

    const newMessage = {
        parent_comment_id: lastCommentId,
        comment_text: comment1,
    }
    const handleImage = (e) => {
        const file = e.target.files[0];
        setImagePath(file);
        setPreviewImage(URL.createObjectURL(file));
    }
    const handleReplies = (e) => {
        e.preventDefault();
        console.log(newMessage);
        setIsLoadingSend(true);
        const formData = new FormData();
        formData.append('jsonData', JSON.stringify(newMessage));
        formData.append("image", imagePath);
        fetch(`${APIPATH}/api/v1/admin/credit/?id=${id}`, {
            headers: {
                'Authorization': `Bearer ${token} `,
                // 'Content-Type': "Application/json"
            },
            method: "POST",
            body: formData,
            mode: "cors"
        })
            .then((res) => res.json)
            .then((data) => {
                console.log(data);
                setComment1("");
                setPreviewImage("");
                getChatDetails();
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => setIsLoadingSend(false))
    }

    return <>
        <div className={style.chat_details_container}>
            {isLoading ?
                <div className={style1.loader_container}>
                    <div className={style1.loader_item}>
                        <img src='/gold-coin.png' alt='loading' />
                    </div>
                </div> :
                <div >
                    {chatDetails?.map((reply, index) => {
                        return (
                            <div key={index}
                                className={style.credit_comment_container}>
                                <h3 >{reply.comment_text}{" "}</h3>
                                <span><sub>{reply.commented_by} ({reply?.created_at.split("T")[0]},{" "}
                                    {reply?.created_at.split("T")[1].split(".")[0]})</sub></span>
                                {reply?.attachment_url !== null &&
                                    <div className={style.replied_image}>
                                        <img src={reply.attachment_url} alt='replied attachetment' />
                                    </div>
                                }
                                {reply.replies && reply.replies.length > 0 && renderReplies(reply.replies)}
                            </div>
                        );
                    })}
                </div>
            }
            <div className={style.comment_input}>
                <form onSubmit={(e) => handleReplies(e)}>
                    <div className={style1.name_label_input_contaner}>
                        <label>Message:</label>
                        <textarea type='text' required placeholder='Enter comment' maxLength={300} value={comment1}
                            onChange={(e) => setComment1(e.target.value)} style={{ width: "95%" }}
                        />
                    </div>
                    <div className={style1.name_label_input_contaner} style={{ marginBottom: "10px" }}>
                        <label>Attached Image(optional)</label>
                        <input style={{ width: "95%" }}
                            type='file'
                            accept="image/*"
                            onChange={handleImage}
                        />
                    </div>
                    {previewImage && <div className={style.uploaded_image}>
                        <img src={previewImage} alt='Attached Document' />
                    </div>}
                    <div className={style.add_merchats_btn_container}>
                        {isLoadingSend ? <div className={style1.loader_container}><div className={style1.loader_item}>
                            <img src='/gold-coin.png' alt='Sending...'/>
                            </div></div> :
                            <button className={style1.primary_login_btn}>Send</button>
                        }
                    </div>
                </form>
            </div>
        </div>
    </>
}

export default ChatWithMerchant;


