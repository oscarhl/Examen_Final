CREATE PROCEDURE [dbo].[MediaTypePagedList]
@startRow int,
@endRow int
AS
BEGIN
SELECT [MediaTypeId]
		,[Name]	
FROM ( SELECT ROW_NUMBER() OVER ( ORDER BY MediaTypeId ) AS RowNum,
		[MediaTypeId]
		,[Name]						
		FROM [dbo].[MediaType]
) AS RowConstrainedResult
WHERE RowNum >= @startRow
AND RowNum <= @endRow
ORDER BY RowNum
END
