using Chinook.Models;
using Microsoft.IdentityModel.Tokens;
using System;

namespace Chinook.WebApi.Authentication
{
    public interface ITokenProvider
    {
        string CreateToken(User user, DateTime expiry);
        TokenValidationParameters GetValidationParameters();
    }
}
