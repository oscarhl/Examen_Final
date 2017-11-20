CREATE PROCEDURE [dbo].[EmployeePagedList]
@startRow int,
@endRow int
AS
BEGIN
SELECT EmployeeId
			,LastName
			,FirstName
			,Title			
			,City			
			,Country					
			,Email		
FROM ( SELECT ROW_NUMBER() OVER ( ORDER BY EmployeeId ) AS RowNum,
			EmployeeId
			,LastName
			,FirstName
			,Title			
			,City			
			,Country					
			,Email				
		FROM [dbo].[Employee]
) AS RowConstrainedResult
WHERE RowNum >= @startRow
AND RowNum <= @endRow
ORDER BY RowNum
END

select *from [dbo].[Employee]