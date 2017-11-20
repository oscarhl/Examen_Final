create PROCEDURE [dbo].[ArtistPagedList]
@startRow int,
@endRow int
AS
BEGIN
SELECT [ArtistId]
		,[Name]	
FROM ( SELECT ROW_NUMBER() OVER ( ORDER BY ArtistId ) AS RowNum,
		[ArtistId]
		,[Name]						
		FROM [dbo].[Artist]
) AS RowConstrainedResult
WHERE RowNum >= @startRow
AND RowNum <= @endRow
ORDER BY RowNum
END
