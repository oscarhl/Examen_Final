CREATE PROCEDURE [dbo].[CustomerPagedList]
@startRow int,
@endRow int
AS
BEGIN
SELECT CustomerId
			,FirstName
			,LastName			
			,City			
			,Country			
			,Phone			
			,Email		
FROM ( SELECT ROW_NUMBER() OVER ( ORDER BY CustomerId ) AS RowNum,
			CustomerId
			,FirstName
			,LastName			
			,City			
			,Country			
			,Phone			
			,Email				
		FROM [dbo].[Customer]
) AS RowConstrainedResult
WHERE RowNum >= @startRow
AND RowNum <= @endRow
ORDER BY RowNum
END

