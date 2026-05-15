using System;
using System.Threading.Tasks;

namespace Gov.Cscp.Victims.Public.Shared.Database;

public interface ICache
{
    Task<T?> GetOrSet<T>(string key, Func<Task<T>> factory, TimeSpan expiration);
}
