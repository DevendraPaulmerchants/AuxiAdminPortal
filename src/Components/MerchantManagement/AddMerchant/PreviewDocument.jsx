import style1 from '../FIle.module.css';

function PreviewDocument({
    setMaxView, setSelectedUrl, selectedUrl
}) {
    return (
        <div className={style1.preview_uploaded_file} >
            <div className={style1.open_file_dimension}>
                <p onClick={() => { setMaxView(false); setSelectedUrl(null) }} className={style1.pdf_close_icon}>X</p>
                <div className={style1.preview_pdf_file}>
                    <iframe className={style1.open_file}
                        src={selectedUrl}
                        title="PDF Preview"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                    />
                </div>
            </div>
        </div >
    )
}
export default PreviewDocument