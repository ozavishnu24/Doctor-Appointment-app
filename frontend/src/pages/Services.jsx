import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getServices } from '../store/servicesSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Services = () => {
  const dispatch = useDispatch();
  const { services, isLoading, isError, message } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  const categoryIcons = {
    'Diagnostic': '🩺',
    'Laboratory': '🧪',
    'Radiology': '📡',
    'Cardiology': '❤️',
    'Other': '🏥',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    // Use the services-bg class instead of inline styles
    <div className="services-bg min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Reduced opacity overlay for better background visibility */}
      <div className="absolute inset-0 bg-white bg-opacity-60"></div>
      
      {/* Content container with improved text contrast */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Medical Services
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-800 sm:mt-4">
            Comprehensive healthcare services to meet all your medical needs
          </p>
        </div>

        {Object.keys(groupedServices).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(groupedServices).map(([category, services]) => (
              <div key={category} className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="bg-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="mr-2">{categoryIcons[category]}</span>
                    {category}
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service) => (
                      <div key={service._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 bg-white bg-opacity-80">
                        <div className="flex items-center mb-4">
                          <div className="bg-indigo-100 rounded-lg p-3 mr-4">
                            <span className="text-2xl">{categoryIcons[category]}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                            <p className="text-sm text-gray-600">{service.duration}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{service.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-indigo-600">₹{service.price}</span>
                          {service.availability ? (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Available
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                              Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-700">No services available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;