export interface LineColumn {
    line: number;
    column: number;
}

export interface SourceRange {
    location: SingleFileSourceRange;
    fileName: string;
}

export interface SingleFileSourceRange {
    start: LineColumn;
    end: LineColumn;
}
