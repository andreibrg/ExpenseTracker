using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net;


namespace ExpenseTracker.API.Common
{
    public static class CustomExceptionHandler
    {
        public static void AddCustomExceptionHandler(this IApplicationBuilder app, ILogger logger)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {   
                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature != null)
                    {   
                        logger.LogError($"Global error: {contextFeature.Error}");
                        //if exception is ItemNotFoundException return 404
                        if (contextFeature.Error is ItemNotFoundException)
                        {
                            context.Response.StatusCode = (int)HttpStatusCode.NotFound;                           
                        }
                        //all other errors should be treated as 500 error code
                        else
                        {
                            context.Response.ContentType = "application/json";
                            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                            await context.Response.WriteAsync(new
                            {
                                StatusCode = context.Response.StatusCode,
                                Message = "Internal Server Error."
                            }.ToString());
                        }
                    }
                });
            });
        }
    }
}