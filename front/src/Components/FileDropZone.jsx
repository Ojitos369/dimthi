import React, { useRef, useState, useCallback, useEffect } from 'react';
import style from './FileDropZone.module.scss';

const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isImage = (file) => file.type?.startsWith('image/');

const FilePreview = ({ file, onRemove }) => {
    const [thumb, setThumb] = useState(null);

    useEffect(() => {
        if (isImage(file)) {
            const url = URL.createObjectURL(file);
            setThumb(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    return (
        <div className={style.fileItem}>
            {thumb ? (
                <img src={thumb} alt="" className={style.fileThumb} />
            ) : (
                <div className={style.fileThumbPlaceholder}>📄</div>
            )}
            <span className={style.fileName}>{file.name}</span>
            <span className={style.fileSize}>{formatSize(file.size)}</span>
            <button type="button" className={style.fileRemove} onClick={onRemove}>✕</button>
        </div>
    );
};

export const FileDropZone = ({ files, setFiles, accept, multiple = true, label = 'Archivos' }) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);
    const zoneRef = useRef(null);
    const dragCounter = useRef(0);

    const addFiles = useCallback((newFiles) => {
        const arr = Array.from(newFiles);
        if (multiple) {
            setFiles(prev => [...prev, ...arr]);
        } else {
            setFiles(arr.slice(0, 1));
        }
    }, [setFiles, multiple]);

    const removeFile = useCallback((idx) => {
        setFiles(prev => prev.filter((_, i) => i !== idx));
    }, [setFiles]);

    const onDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        setIsDragging(true);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;
        if (e.dataTransfer.files?.length > 0) {
            addFiles(e.dataTransfer.files);
        }
    };

    const onPaste = (e) => {
        if (e.clipboardData.files?.length > 0) {
            e.preventDefault();
            addFiles(e.clipboardData.files);
        }
    };

    const onClick = () => {
        inputRef.current?.click();
    };

    const onInputChange = (e) => {
        if (e.target.files?.length > 0) {
            addFiles(e.target.files);
        }
        e.target.value = '';
    };

    return (
        <div>
            <div
                ref={zoneRef}
                className={`${style.dropZone} ${isDragging ? style.dropZoneDragging : ''}`}
                onClick={onClick}
                onDragEnter={onDragEnter}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onPaste={onPaste}
                tabIndex={0}
            >
                <div className={style.dropIcon}>📁</div>
                <div className={style.dropText}>
                    <span className={style.dropAccent}>Haz clic</span>, arrastra archivos aquí
                    <br />o pega desde el portapapeles
                </div>
                <div className={style.dropHint}>
                    {accept || 'Cualquier archivo'} {multiple ? '• Múltiples archivos' : '• Un archivo'}
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    className={style.hiddenInput}
                    accept={accept}
                    multiple={multiple}
                    onChange={onInputChange}
                />
            </div>
            {files.length > 0 && (
                <div className={style.fileList}>
                    {files.map((f, idx) => (
                        <FilePreview key={`${f.name}-${idx}`} file={f} onRemove={() => removeFile(idx)} />
                    ))}
                </div>
            )}
        </div>
    );
};
